using SignalRDemo3ytEFC.Data;
using SignalRDemo3ytEFC.Models;
using System.Data;
using System.Data.SqlClient;

namespace SignalRDemo3ytEFC.Repositories
{
    public class ProductRepository
    {
        string connectionString;
        private readonly ApplicationDbContext dbContext;


        public ProductRepository(string connectionString, ApplicationDbContext _dbContext)
        {
            this.connectionString = connectionString;
            this.dbContext = _dbContext;
        }

        public List<Product> GetProducts()
        {
            var prodList = dbContext.Product.ToList();
            foreach (var prod in prodList)
            {
                dbContext.Entry(prod).Reload();
            }
            //var f = dbContext.Product.ToList();
            return prodList;
        }

        public List<ProductForGraph> GetProductsForGraph()
        {
            List<ProductForGraph> productsForGraph = new List<ProductForGraph>();

            productsForGraph = dbContext.Product.GroupBy(p => p.Category)
                .Select(g => new ProductForGraph
                {
                                Category = g.Key,
                                Products = g.Count()
                            }).ToList();
            return productsForGraph;
        }
    }
}
